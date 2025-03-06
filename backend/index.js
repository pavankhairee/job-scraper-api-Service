import puppeteer from "puppeteer";

let allJobs = [];

console.log(allJobs)
async function scrapeJobs(url, company) {
    console.log(`Scraping jobs from ${company} Wait a minute`);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // 
    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
        await page.waitForSelector(".QJPWVe", { timeout: 15000 });

        console.log(`Job elements found for ${company}, extracting data...`);
        let jobs = await page.evaluate(() => {
            return [...document.querySelectorAll(".QJPWVe")].map((el) => ({
                title: el.innerText,
                company: "Google",
                location: document.querySelector(".pwO9Dc")?.innerText.replace(/^place/, "").trim(),
                link: document.querySelector(".WpHeLc").href,
                qualifications: document.querySelector(".Xsxa1e ul").innerText.replace(/^'\n'/, "").trim()
            }));
        });

        // allJobs = [...allJobs, ...jobs];
        allJobs.push(jobs)

    } catch (error) {
        console.error(`Failed to scrape ${company}:`, error);
    }
    await browser.close();
}


scrapeJobs("https://careers.google.com/jobs/results/", "Google").then(async () => {

    console.log("All Jobs:", allJobs);
});







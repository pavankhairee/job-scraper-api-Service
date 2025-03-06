import puppeteer from "puppeteer";
import { JobModel } from "./Database.js";
import express from "express"
import { json } from "stream/consumers";
import mongoose from "mongoose";
import { DB_URL } from "./config.js";
const app = express();
app.use(express.json());
let allJobs = [];

async function connectdb() {
    await mongoose.connect(DB_URL)
}
connectdb();

console.log(allJobs)
async function scrapeJobs(url, company) {
    console.log(`Scraping jobs from ${company} Wait a minute`);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // 
    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
        await page.waitForSelector(".QJPWVe", { timeout: 15000 });

        console.log(`Job elements found for ${company}, extracting data...`);
        let jobs = await page.evaluate(() => {
            return [...document.querySelectorAll(".sMn82b")].map((el) => ({
                title: el.querySelector(".QJPWVe").innerText,
                company: "Google",
                location: el.querySelector(".r0wTof ")?.innerText.replace(/^place/, "").trim(),
                link: el.querySelector(".WpHeLc ").href,
                qualifications: el.querySelector(".Xsxa1e ul").innerText.replace(/^'\n'/, "").trim()
            }));
        });
        // await JobModel.insertMany(jobs)
        // allJobs = [...allJobs, ...jobs];
        // allJobs.push(jobs)
        for (let job of jobs) {
            await JobModel.updateOne(
                { link: job.link },
                { $set: job },
                { upsert: true }
            );
        }


    } catch (error) {
        console.error(`Failed to scrape ${company}:`, error);
    }
    await browser.close();
}


app.get("/api/jobs", async (req, res) => {
    try {
        const jobs = await JobModel.find();
        res.json({
            jobs
        })
    } catch (e) {
        res.json({
            message: "Error featching the data from the site"
        })
    }
})

app.listen(3000);
scrapeJobs("https://www.google.com/about/careers/applications/jobs/results", "Google")







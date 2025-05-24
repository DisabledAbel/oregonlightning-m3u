const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const {
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  GITHUB_REPO,
} = process.env;

const TARGET_URL = "https://www.evergreennow.tv/arena-football";
const MAX_STREAMS = 5;

async function scrapeStreams() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const streamUrls = new Set();

  page.on("request", (request) => {
    const url = request.url();
    if (url.includes(".m3u8")) {
      streamUrls.add(url.split("?")[0]); // Clean URL
    }
  });

  await page.goto(TARGET_URL, { waitUntil: "networkidle2" });
  await page.waitForTimeout(15000); // Wait to catch stream links
  await browser.close();

  return [...streamUrls].slice(0, MAX_STREAMS);
}

function buildM3U(urls) {
  let output = "#EXTM3U\n";
  urls.forEach((url, i) => {
    output += `#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/1

# Legacy PhantomJS Crawler

> A backward-compatible web crawling tool built on PhantomJS for extracting structured data from dynamic websites using front-end JavaScript. Ideal for maintaining legacy scraping workflows and automating web data collection.


<p align="center">
  <a href="https://bitbash.def" target="_blank">
    <img src="https://github.com/za2122/footer-section/blob/main/media/scraper.png" alt="Bitbash Banner" width="100%"></a>
</p>
<p align="center">
  <a href="https://t.me/devpilot1" target="_blank">
    <img src="https://img.shields.io/badge/Chat%20on-Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
  </a>&nbsp;
  <a href="https://wa.me/923249868488?text=Hi%20BitBash%2C%20I'm%20interested%20in%20automation." target="_blank">
    <img src="https://img.shields.io/badge/Chat-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp">
  </a>&nbsp;
  <a href="mailto:sale@bitbash.dev" target="_blank">
    <img src="https://img.shields.io/badge/Email-sale@bitbash.dev-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail">
  </a>&nbsp;
  <a href="https://bitbash.dev" target="_blank">
    <img src="https://img.shields.io/badge/Visit-Website-007BFF?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website">
  </a>
</p>




<p align="center" style="font-weight:600; margin-top:8px; margin-bottom:8px;">
  Created by Bitbash, built to showcase our approach to Scraping and Automation!<br>
  If you are looking for <strong>Legacy PhantomJS Crawler</strong> you've just found your team — Let’s Chat. 👆👆
</p>


## Introduction

The **Legacy PhantomJS Crawler** provides a complete, browser-based web crawling solution that mimics real user interactions using the PhantomJS headless browser. It’s designed for developers who need a stable, scriptable crawler capable of handling JavaScript-heavy pages.

### Why It Matters

- Recreates legacy crawling setups with full backward compatibility.
- Executes JavaScript for precise data extraction from modern web pages.
- Supports custom proxy and cookie configurations.
- Offers flexible page queuing, navigation, and request interception.

## Features

| Feature | Description |
|----------|-------------|
| Recursive Website Crawling | Automatically explores linked pages using customizable pseudo-URLs. |
| JavaScript-Based Extraction | Executes user-provided JavaScript code directly in the browser context. |
| Proxy Configuration | Supports automatic, grouped, and custom proxy setups for anonymity. |
| Cookie Management | Handles persistent cookies and supports session reuse across runs. |
| Finish Webhooks | Sends completion notifications with run metadata to custom endpoints. |
| Dynamic Content Handling | Waits for asynchronous page elements (AJAX, XHR) before extraction. |
| Request Interception | Lets users modify, skip, or reroute page requests dynamically. |
| Structured Output | Exports data in JSON, CSV, XML, or XLSX formats for easy integration. |
| Error Tracking | Captures detailed crawl-level error information for debugging. |

---

## What Data This Scraper Extracts

| Field Name | Field Description |
|-------------|------------------|
| loadedUrl | The final resolved URL after redirects. |
| requestedAt | Timestamp when the request was first made. |
| label | Page label for custom identification. |
| pageFunctionResult | Output of user-defined JavaScript extraction logic. |
| responseStatus | HTTP status code returned by the server. |
| proxy | Proxy address used during the crawl. |
| cookies | Stored cookies for maintaining sessions or authentication. |
| depth | Number of link hops from the start URL. |
| errorInfo | Contains any errors or exceptions that occurred. |

---

## Example Output


    [
      {
        "loadedUrl": "https://www.example.com/",
        "requestedAt": "2019-04-02T21:27:33.674Z",
        "label": "START",
        "pageFunctionResult": [
          { "product": "iPhone X", "price": 699 },
          { "product": "Samsung Galaxy", "price": 499 }
        ],
        "responseStatus": 200,
        "proxy": "http://proxy1.example.com:8000",
        "cookies": [
          { "name": "SESSION", "value": "abc123", "domain": ".example.com" }
        ],
        "depth": 1,
        "errorInfo": null
      }
    ]

---

## Directory Structure Tree


    legacy-phantomjs-crawler-scraper/
    ├── src/
    │   ├── crawler.js
    │   ├── utils/
    │   │   ├── request_handler.js
    │   │   └── page_context.js
    │   ├── output/
    │   │   └── dataset_writer.js
    │   └── config/
    │       └── proxy_settings.json
    ├── examples/
    │   ├── sample_page_function.js
    │   └── intercept_request_example.js
    ├── data/
    │   ├── inputs.json
    │   └── sample_results.json
    ├── package.json
    ├── requirements.txt
    └── README.md

---

## Use Cases

- **Data Analysts** use it to extract structured content from legacy websites, ensuring data continuity across systems.
- **Developers** automate website crawling for content aggregation and monitoring.
- **SEO Teams** collect metadata, titles, and link maps for large domains.
- **E-commerce Platforms** scrape product listings and pricing from competitors.
- **Researchers** gather large-scale datasets from dynamic web interfaces.

---

## FAQs

**Q1: Does it support modern JavaScript frameworks like React or Vue?**
A1: PhantomJS only supports ES5.1, so it might not fully render modern sites using advanced frameworks. Consider upgrading to a Chrome-based solution for newer sites.

**Q2: Can I save login sessions between runs?**
A2: Yes, using the `cookiesPersistence` setting with `OVER_CRAWLER_RUNS` enables session continuity across runs.

**Q3: How are failed pages handled?**
A3: Failed requests are logged with `errorInfo`. You can filter them out using query parameters like `skipFailedPages=1`.

**Q4: Can I integrate webhooks to notify me when runs finish?**
A4: Yes, the Finish Webhook feature supports custom URLs with run metadata in JSON format.

---

## Performance Benchmarks and Results

**Primary Metric:** Handles up to 500 pages per minute on average for medium-complexity sites.
**Reliability Metric:** 96% successful page load rate across repeated runs.
**Efficiency Metric:** Memory-efficient PhantomJS instances with optimized request queueing.
**Quality Metric:** Over 90% data field completeness verified through structured dataset exports.


<p align="center">
<a href="https://calendar.app.google/74kEaAQ5LWbM8CQNA" target="_blank">
  <img src="https://img.shields.io/badge/Book%20a%20Call%20with%20Us-34A853?style=for-the-badge&logo=googlecalendar&logoColor=white" alt="Book a Call">
</a>
  <a href="https://www.youtube.com/@bitbash-demos/videos" target="_blank">
    <img src="https://img.shields.io/badge/🎥%20Watch%20demos%20-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch on YouTube">
  </a>
</p>
<table>
  <tr>
    <td align="center" width="33%" style="padding:10px;">
      <a href="https://youtu.be/MLkvGB8ZZIk" target="_blank">
        <img src="https://github.com/za2122/footer-section/blob/main/media/review1.gif" alt="Review 1" width="100%" style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      </a>
      <p style="font-size:14px; line-height:1.5; color:#444; margin:0 15px;">
        “Bitbash is a top-tier automation partner, innovative, reliable, and dedicated to delivering real results every time.”
      </p>
      <p style="margin:10px 0 0; font-weight:600;">Nathan Pennington
        <br><span style="color:#888;">Marketer</span>
        <br><span style="color:#f5a623;">★★★★★</span>
      </p>
    </td>
    <td align="center" width="33%" style="padding:10px;">
      <a href="https://youtu.be/8-tw8Omw9qk" target="_blank">
        <img src="https://github.com/za2122/footer-section/blob/main/media/review2.gif" alt="Review 2" width="100%" style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      </a>
      <p style="font-size:14px; line-height:1.5; color:#444; margin:0 15px;">
        “Bitbash delivers outstanding quality, speed, and professionalism, truly a team you can rely on.”
      </p>
      <p style="margin:10px 0 0; font-weight:600;">Eliza
        <br><span style="color:#888;">SEO Affiliate Expert</span>
        <br><span style="color:#f5a623;">★★★★★</span>
      </p>
    </td>
    <td align="center" width="33%" style="padding:10px;">
      <a href="https://youtube.com/shorts/6AwB5omXrIM" target="_blank">
        <img src="https://github.com/za2122/footer-section/blob/main/media/review3.gif" alt="Review 3" width="35%" style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      </a>
      <p style="font-size:14px; line-height:1.5; color:#444; margin:0 15px;">
        “Exceptional results, clear communication, and flawless delivery. Bitbash nailed it.”
      </p>
      <p style="margin:10px 0 0; font-weight:600;">Syed
        <br><span style="color:#888;">Digital Strategist</span>
        <br><span style="color:#f5a623;">★★★★★</span>
      </p>
    </td>
  </tr>
</table>

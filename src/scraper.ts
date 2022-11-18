import puppeteer from "puppeteer";
import ReferencePages from "./mdnpages/ReferencePages";

type MDNPage =
	| typeof ReferencePages.JS[keyof typeof ReferencePages.JS]
	| typeof ReferencePages.HTML[keyof typeof ReferencePages.HTML]
	;

async function screenshot(page: puppeteer.Page, sectionLabel: string) {
	const elem = (await page.$(`section[aria-labelledby="${sectionLabel}"]`))?.asElement();
	if(!elem) throw new Error(`Couldn't find section with label "${sectionLabel}"`);
	elem.evaluate(n => n.style.padding = "2rem");
	const buff = await elem.screenshot({omitBackground: true});
	if(!Buffer.isBuffer(buff)) throw new Error("Unable to resolve response into buffer.");

	return buff;
}

async function goto(page: puppeteer.Page, url: MDNPage) {
	await page.goto(url);
}

export default async function initialize() {
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();
	await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 1});

	return {
		goto: async (url: MDNPage) => await goto(page, url),
		screenshot: async (section: string) => await screenshot(page, section),
	} as const;

}

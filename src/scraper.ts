import puppeteer from "puppeteer";
import ReferencePages from "./mdnpages/ReferencePages";

type MDNPage =
	| typeof ReferencePages.JS[keyof typeof ReferencePages.JS]
	| typeof ReferencePages.HTML[keyof typeof ReferencePages.HTML]
	;

async function screenshot(page: puppeteer.Page, sectionLabel: string) {
	const elem = (await page.$(`section[aria-labelledby="${sectionLabel}"]`))?.asElement();
	if(!elem) throw new Error(`Couldn't find section with label "${sectionLabel}"`);

	await elem.$$eval(`.section-content > *`, ns => ns.forEach(n => {
		if(!n.tagName) return;
		n.style.padding = "2rem";
	}));
	const buffers = await Promise.all((await elem.$$(`.section-content > *`)).map(async n => {
		if(!n.asElement()) return;
		const buff = await n.screenshot({omitBackground: true, type: "jpeg", quality: 100});
		if(!Buffer.isBuffer(buff)) return;
		return buff;
	}));
	return buffers.filter(x => !!x);
}

async function goto(page: puppeteer.Page, url: `${MDNPage}#${string}` | MDNPage) {
	await page.goto(url);
}

export default async function initialize() {
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();
	await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 1});

	return {
		goto: async (url: `${MDNPage}#${string}` | MDNPage) => await goto(page, url),
		screenshot: async (section: string) => await screenshot(page, section),
	} as const;

}

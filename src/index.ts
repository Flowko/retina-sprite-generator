#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
const __dirname = path.resolve();

// const
const url = 'https://www.facetstudios.com/sprite-generator';
const userAgent =
  'Mozilla/5.0 (X11; Linux x86_64)' +
  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
const options = {
  width: 0,
  height: 0,
  delay: 5000,
};

const askCurrentDirectory = async (): Promise<boolean> => {
  const { currentDirectory } = await inquirer.prompt({
    name: 'currentDirectory',
    type: 'confirm',
    message: '🔽 Select Current Directory?',
    default() {
      return 'retina-sprite-generator';
    },
  });

  return currentDirectory;
};

const askDirectory = async (): Promise<string> => {
  const { directory } = await inquirer.prompt({
    name: 'directory',
    type: 'input',
    message: '🚀 Select Which folder you wanna convert?',
    default() {
      return 'retina-sprite-generator';
    },
  });

  return directory;
};

const delay = async (time: number) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

const run = async () => {
  try {
    var directory: string = '';
    const isCurrentDirectory = await askCurrentDirectory();
    if (isCurrentDirectory) {
      directory = __dirname;
    } else {
      const directoryPath = await askDirectory();
      directory = directoryPath;
    }
    const browser = await puppeteer.launch({
      headless: false,
      args: [`--window-size=${options.width},${options.height}`],
    });
    const page = await browser.newPage();

    await page.setUserAgent(userAgent);
    await page.goto(url);
    const elementHandle = await page.$('#imgfiles[type=file]');

    const files: string[] = [];
    await fs.readdirSync(directory).forEach((file) => {
      files.push(`${directory}/${file}`);
    });

    await elementHandle?.uploadFile(...files);
    await page.$eval('#spritename', (el: any) => (el.value = 'icon77'));
    await page.click('#swon-3');
    await delay(1000);
    await page.click('#downloadbtn');

    await delay(options.delay);
    console.log('✅ Check your Downloads Folder');

    await browser.close();
  } catch (error) {
    if (error instanceof Error) {
      console.log('\n ❌ Something went wrong:', error.message);
      return;
    }

    throw error;
  }
};

await run();

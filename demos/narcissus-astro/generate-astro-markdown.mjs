import path from 'path';
import fs from 'fs';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.resolve();
const BLOG_PATH = 'content/blog';
const mardownFrontmatter = 'layout: ../components/Layout/BlogPost.astro';

const outputDirectory = 'src/pages';
const createPostMarkdown = (location) => {
  const directories = fs
    .readdirSync(location)
    .filter((element) => fs.lstatSync(`${location}/${element}`).isDirectory());

  directories.forEach((element) => {
    const contentSourcePath = `${location}/${element}/index.md`;
    const contentOutputPath = path.join(__dirname, `${outputDirectory}/${element}.md`);
    const fileContents = fs.readFileSync(contentSourcePath, { encoding: 'utf-8' });
    const startIndex = fileContents.indexOf('---', 0);
    const endIndex = startIndex + 3;
    const updatedContents = `${fileContents.substring(
      0,
      endIndex,
    )}\n${mardownFrontmatter}${fileContents.substring(endIndex)}`;
    fs.writeFileSync(contentOutputPath, updatedContents, { encoding: 'utf-8' });
  });
};

const location = path.join(__dirname, BLOG_PATH);

createPostMarkdown(location);

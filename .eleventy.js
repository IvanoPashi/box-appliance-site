module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/css");
  // sitemap.xml is generated via sitemap.liquid template, not copied
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy({
    "src/5231d14171a14f6da1939642aec3ea7f.txt":
      "5231d14171a14f6da1939642aec3ea7f.txt",
  });

  // Copy favicon files to root
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon/favicon.ico": "favicon.ico",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon/favicon-16x16.png": "favicon-16x16.png",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon/favicon-32x32.png": "favicon-32x32.png",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon/apple-touch-icon.png": "apple-touch-icon.png",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon/android-chrome-192x192.png":
      "android-chrome-192x192.png",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon/android-chrome-512x512.png":
      "android-chrome-512x512.png",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon/browserconfig.xml": "browserconfig.xml",
  });

  // Watch for changes in CSS files
  eleventyConfig.addWatchTarget("src/css/");

  // Add quiet mode for cleaner output
  eleventyConfig.setQuietMode(process.env.NODE_ENV === "production");

  // Improve build performance
  eleventyConfig.setDataDeepMerge(true);

  // Helper function for date sorting
  const sortByDateDesc = (a, b) => b.date - a.date;

  // Create blog collection for better organization (sorted by date, newest first)
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/brands/*/content/blog/*.{md,liquid}")
      .sort(sortByDateDesc);
  });

  // Create Sub-Zero blog collection
  eleventyConfig.addCollection("sub-zeroBlog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/brands/sub-zero/content/blog/*.{md,liquid}")
      .sort(sortByDateDesc);
  });

  // Create Wolf blog collection
  eleventyConfig.addCollection("wolfBlog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/brands/wolf/content/blog/*.{md,liquid}")
      .sort(sortByDateDesc);
  });

  // Create Cove blog collection
  eleventyConfig.addCollection("coveBlog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/brands/cove/content/blog/*.{md,liquid}")
      .sort(sortByDateDesc);
  });

  // Create featured blog collection (most recent 3 posts from all brands)
  eleventyConfig.addCollection("featuredBlog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/brands/*/content/blog/*.{md,liquid}")
      .sort(sortByDateDesc)
      .slice(0, 3);
  });

  // Create featured Sub-Zero blog collection
  eleventyConfig.addCollection(
    "featured-sub-zeroBlog",
    function (collectionApi) {
      return collectionApi
        .getFilteredByGlob("src/brands/sub-zero/content/blog/*.{md,liquid}")
        .sort(sortByDateDesc)
        .slice(0, 3);
    }
  );

  // Create featured Wolf blog collection
  eleventyConfig.addCollection("featured-wolfBlog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/brands/wolf/content/blog/*.{md,liquid}")
      .sort(sortByDateDesc)
      .slice(0, 3);
  });

  // Create featured Cove blog collection
  eleventyConfig.addCollection("featured-coveBlog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/brands/cove/content/blog/*.{md,liquid}")
      .sort(sortByDateDesc)
      .slice(0, 3);
  });

  // Add date filters for SEO and readability
  eleventyConfig.addFilter("dateIso", function (dateObj) {
    if (!dateObj) return new Date().toISOString();
    const date = new Date(dateObj);
    return isNaN(date.getTime())
      ? new Date().toISOString()
      : date.toISOString();
  });

  eleventyConfig.addFilter("dateReadable", function (dateObj) {
    if (!dateObj) return "";
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("dateShort", function (dateObj) {
    if (!dateObj) return "";
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  // Add excerpt filter for meta descriptions and previews
  eleventyConfig.addFilter("excerpt", function (content, length = 160) {
    if (!content) return "";

    // Remove HTML tags if present
    const text = content.replace(/<[^>]*>/g, "");

    if (text.length <= length) return text;

    // Find the last complete word within the length limit
    const truncated = text.substring(0, length);
    const lastSpace = truncated.lastIndexOf(" ");

    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  });

  // Add word count filter
  eleventyConfig.addFilter("wordCount", function (content) {
    if (!content) return 0;
    try {
      const text = content.replace(/<[^>]*>/g, "");
      return text.split(/\s+/).filter((word) => word.length > 0).length;
    } catch (err) {
      console.warn("Word count filter error:", err);
      return 0;
    }
  });

  // Add reading time filter
  eleventyConfig.addFilter("readingTime", function (content) {
    if (!content) return "1 min read";
    try {
      const wordsPerMinute = 200;
      const wordCount = content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const minutes = Math.ceil(wordCount / wordsPerMinute);
      return `${minutes} min read`;
    } catch (err) {
      console.warn("Reading time filter error:", err);
      return "1 min read";
    }
  });

  // Template processing for dynamic content (for multi-brand support)
  eleventyConfig.addFilter("template", function (str, data) {
    if (!str || typeof str !== "string") return str;

    // Replace template variables like {{site.appliance_brand}}
    return str.replace(/\{\{\s*([^}]+)\s*\}\}/g, function (match, path) {
      const keys = path.split(".");
      let value = data;

      for (let key of keys) {
        if (value && typeof value === "object" && key in value) {
          value = value[key];
        } else {
          return match; // Return original if path not found
        }
      }

      return value || match;
    });
  });

  // Slug filter for URL-safe strings
  eleventyConfig.addFilter("slug", function (str) {
    if (!str) return "";
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  });

  // Add slugify alias for compatibility
  eleventyConfig.addFilter("slugify", function (str) {
    if (!str) return "";
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  });

  // JSON-LD structured data filter
  eleventyConfig.addFilter("jsonLd", function (data) {
    return JSON.stringify(data);
  });

  // URL helper for absolute URLs
  eleventyConfig.addFilter("absoluteUrl", function (url, base) {
    if (!url) return base || "";
    if (url.startsWith("http")) return url;
    const baseUrl = base || this.ctx.site?.url || "";
    return new URL(url, baseUrl).toString();
  });

  // URL normalization filter to ensure trailing slashes
  eleventyConfig.addFilter("normalizeUrl", function (url) {
    if (!url) return "/";
    // Don't add trailing slash to file extensions or URLs that already have one
    if (url.includes(".") || url.endsWith("/")) return url;
    return url + "/";
  });

  // HTML minification (production only)
  if (process.env.NODE_ENV === "production") {
    const { minify } = require("@minify-html/node");
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        try {
          return minify(Buffer.from(content), {
            keep_closing_tags: true,
            keep_html_and_head_opening_tags: true,
            keep_spaces_between_attributes: true,
            minify_css: true,
            minify_js: true,
          }).toString();
        } catch (err) {
          console.warn("HTML minification failed:", err);
          return content;
        }
      }
      return content;
    });
  }

  // Set input and output directories
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["liquid", "md", "html"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    dataTemplateEngine: "liquid",
  };
};

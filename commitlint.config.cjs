module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "apps/narcissus-dashboard",
        "demos/narcissus-astro",
        "demos/narcissus-sveltekit",
        "narcissus/root",
        "services/narcissus-api",
        "apps",
        "demos",
        "narcissus",
        "narcissus-api",
        "narcissus-astro",
        "narcissus-dashboard",
        "narcissus-sveltekit",
        "root",
      ],
    ],
    "scope-empty": [2, "never"],
  },
};

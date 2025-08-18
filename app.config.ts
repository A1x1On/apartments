export default defineAppConfig({
  foo: "bar",
  ERROR_NULL: new Error("Request returned null data"),
  ui: {
    slider: {
      slots: {
        root: "custom-slider",
        track: "track",
        range: "bg",
        thumb: "bg ring-2",
      },
    },

    colors: {
      // primary: "green",
      // success: "emerald",
    },
  },
});

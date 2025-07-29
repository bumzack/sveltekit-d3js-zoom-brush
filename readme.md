# a brushabe and zoomable D3js chart in sveltekit

a brushable and zoomable multi line chart in SvelteKit & D3js


## Screenshot

[Screenshot](https://github.com/bumzack/sveltekit-d3js-zoom-brush/screenshot.png)

## based on

- I took some inspiration from the following stack overflow discussion: https://stackoverflow.com/questions/57956581/svelte-and-d3-brush
- The ```Axis``` components are taken from: https://datavisualizationwithsvelte.com/basics/svelte-5-d3-example

## installation

### backend

you need a server that provides some data. there are 2 servers available:

- NodeJS using [koa](./backend-node)
- Rust using [axum](./backend-rust)

or you implement your own server - requirements:
- a single REST endpoint ```/GET``` path ```/api/chartdata```
- returns the data provided in the file ```multline_chart.json```
- port ```3000```

#### NodeJS

- `npm i`
- `npm run dev`

#### Rust

- `cargo run`

### frontend

The frontend is implemented in SvelteKit 5, d3js and bootstrap. It works :-).

- `npm i`
- `npm run dev`

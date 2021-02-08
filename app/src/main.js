import App from './App.svelte';

const url = 'https://raw.githubusercontent.com/fndvit/covid-vaccine-effects-tracker/main/app/public/data_residence.json';

fetch(url)
  .then((res) => res.json())
  .then((json) => {
  const data = json;
  console.log(data)
    const app = new App({
      target: document.body,
      props: {
        data: data
      }
	});
});

export default app;
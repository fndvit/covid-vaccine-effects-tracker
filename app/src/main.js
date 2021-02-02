import App from './App.svelte';

const url = 'data_residence.json';//'https://raw.githubusercontent.com/fndvit/covid-vaccine-effects-tracker/app/public/catalunya_setmanals.json';

fetch(url)
  .then((res) => res.json())
  .then((json) => {
	const data = json;

    const app = new App({
      target: document.body,
      props: {
		data: data
      }
	});
});

export default app;



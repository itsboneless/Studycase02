export async function renderdrivers() {

  const url = "http://api.jolpi.ca/ergast/f1/2024/drivers/";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
  renderdrivers();
}
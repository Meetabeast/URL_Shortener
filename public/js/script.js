let urlText = document.getElementById("url");
let urlButton = document.getElementById("generate");
let urlTextElement = document.getElementById("text");


urlButton.addEventListener("click", async () => {
    urlText = urlText.value;

    let response = await fetch(`/url/generate?url=${urlText}`, { method: "POST" }).then(res => res.json()).catch(err => alert('Something went wrong!'));

    urlTextElement.innerText += `Your personal shorted url: http://localhost:3000/url?id=${response.id}`;
}); 
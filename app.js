window.addEventListener("load", () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (urlSearchParams.has("search")) {
    document.querySelector("#loader").removeAttribute("style");
    search(urlSearchParams.get("search"));
  }
});

document.querySelector("#search-input").addEventListener("keypress", function (event) {
  if (event.key === "Enter" && this.value != "") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set("search", this.value);
    window.location.search = urlSearchParams;
  }
});

async function search(value) {
  const response = await fetch("https://civitai.com/api/v1/models?sort=Most Downloaded&query=" + value);
  const json = await response.json();
  document.querySelector("#search-results").innerHTML = "";

  json.items.forEach((item) => addCard(item));
}

function addCard(item) {
  const card = document.createElement("article");
  card.classList.add("image-card");
  let innerHTML = `<div class="maintain-aspect-ratio"><div class="images hidden" onclick="showDetails(this, event);" >`;
  item.modelVersions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  item.modelVersions.forEach((version, index) => {
    if (index === 0) innerHTML += `<figure class="selected">`;
    else innerHTML += `<figure>`;
    if (version.images.length > 0) innerHTML += `<img src="${encodeHTML(version.images[0].url)}" alt="" /><figcaption>`;
    else innerHTML += `<img src="" alt="" /><figcaption>`;
    version.trainedWords.forEach((trainedWords) => (innerHTML += `<div class="details">${encodeHTML(trainedWords)}<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg></div>`));
    innerHTML += `<div class="details">${encodeHTML(version.downloadUrl)}<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg></div></figcaption></figure>`;
  });
  innerHTML += `</div><nav><div class="hidden" onclick="toggleImage(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/>
    </svg></div><section>`;
  item.modelVersions.forEach((version, index) => {
    if (index === 0) innerHTML += `<span class="version selected" onclick="selectVersion(this);" data-index="${index}">V${index + 1}</span>`;
    else innerHTML += `<span class="version" onclick="selectVersion(this);" data-index="${index}">V${index + 1}</span>`;
  });
  innerHTML += `</section></nav><p class="info"><span class="creator">${encodeHTML(item.creator.username)} · ${encodeHTML(item.type)}</span>${encodeHTML(item.name)}</p></div></div>`;
  card.innerHTML = innerHTML;
  document.querySelector("#search-results").append(card);
}

function selectVersion(element) {
  element.parentElement.childNodes.forEach((node) => node.classList.remove("selected"));
  element.classList.add("selected");
  element.parentElement.parentElement.parentElement.firstElementChild.childNodes.forEach((node) => node.classList.remove("selected"));
  element.parentElement.parentElement.parentElement.firstElementChild.childNodes[parseInt(element.dataset.index)].classList.add("selected"); // div onclick => nav => div .maintain-aspect-ratio => div .images => figure with image
}

function toggleImage(element) {
  element.classList.toggle("hidden");
  if (element.classList.contains("hidden")) element.firstElementChild.innerHTML = '<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />';
  else element.firstElementChild.innerHTML = '<path d="m840-234-80-80v-446H314l-80-80h526q33 0 56.5 23.5T840-760v526ZM792-56l-64-64H200q-33 0-56.5-23.5T120-200v-528l-64-64 56-56 736 736-56 56ZM240-280l120-160 90 120 33-44-283-283v447h447l-80-80H240Zm297-257ZM424-424Z" />';
  element.parentElement.parentElement.firstElementChild.classList.toggle("hidden"); // div onclick => nav => div .maintain-aspect-ratio => div .images
}

function showDetails(element, event) {
  if (event.target.classList.contains("details") || event.target.parentElement.classList.contains("details")) {
    let copyText = event.target;
    if (event.target.parentElement.classList.contains("details")) copyText = copyText.parentElement;
    navigator.clipboard.writeText(copyText.textContent);
    copyText.classList.add("accent-color");
    copyText.firstElementChild.innerHTML = '<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>';
    setTimeout(() => {
      copyText.classList.remove("accent-color");
      copyText.firstElementChild.innerHTML = '<path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>';
    }, 1000);
  } else element.classList.toggle("show-details");
}

function encodeHTML(text) {
  return text.replace(/[&"'\<\>]/g, function (c) {
    switch (c) {
      case "&":
        return "&amp;";
      case "'":
        return "&#39;";
      case '"':
        return "&quot;";
      case "<":
        return "&lt;";
      default:
        return "&gt;";
    }
  });
}

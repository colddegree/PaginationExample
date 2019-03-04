const LOREM = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium adipisci, aliquam animi architecto autem dolor eius, est et, iste natus quod voluptates. Aspernatur distinctio eveniet incidunt ipsam laboriosam sequi! Soluta?";

const PICS_PER_PAGE = 3;

let picsContainer = document.getElementById("pics-container");

let currPage = 1;
let pics = [];
let amountOfPages = 0;

let pagination = {
    first: document.getElementById("p-first"),
    prev: document.getElementById("p-prev"),
    pages: document.getElementById("p-pages"),
    next: document.getElementById("p-next"),
    last: document.getElementById("p-last")
};

fetch("data.json")
    .then(response => response.json())
    .then(items => items.forEach(item => pics.push(item)))
    .then(_ =>  amountOfPages = Math.ceil(pics.length / PICS_PER_PAGE))
    .then(_ => initPagination())
    .then(_ => updatePage());

function getPicsOn(page) {
    let sliceLowerBound = (page - 1) * PICS_PER_PAGE;
    let sliceUpperBound = page * PICS_PER_PAGE; // exclusive

    return pics.slice(sliceLowerBound, sliceUpperBound);
}

function createPictureElement(pic) {
    let pictureElement = document.createElement("div");
    pictureElement.classList.add("picture");

    let img = document.createElement("img");
    img.src = pic.imageUrl;

    let title = document.createElement("h3");
    title.appendChild(
        document.createTextNode(pic.title)
    );

    let description = document.createElement("p");
    description.appendChild(
        document.createTextNode(LOREM)
    );

    pictureElement.appendChild(img);
    pictureElement.appendChild(title);
    pictureElement.appendChild(description);

    return pictureElement;
}

function updatePage() {
    clearChildrenOf(picsContainer);

    clearChildrenOf(pagination.prev);
    clearChildrenOf(pagination.pages);
    clearChildrenOf(pagination.next);

    getPicsOn(currPage).forEach(pic => picsContainer.appendChild(
        createPictureElement(pic)));

    for (let i = 1; i <= amountOfPages; i++) {
        let li = document.createElement("li");
        li.appendChild(createPageSwitchButton(i));
        pagination.pages.appendChild(li);
    }

    pagination.prev.appendChild(
        (currPage - 1 >= 1)
            ? createPageSwitchButton(currPage - 1, "<")
            : document.createTextNode("<")
    );

    pagination.next.appendChild(
        (currPage + 1 <= amountOfPages)
            ? createPageSwitchButton(currPage + 1, ">")
            : document.createTextNode(">")
    );
}

function clearChildrenOf(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createPageSwitchButton(pageToSwitch, text = pageToSwitch, applyStyles = true) {
    let btn = document.createElement("a");

    if (applyStyles && pageToSwitch === currPage)
        btn.classList.add("current-page");
    else {
        btn.addEventListener("click", () => {
            currPage = pageToSwitch;
            updatePage();
        });
    }

    btn.appendChild(
        document.createTextNode(text)
    );

    return btn;
}

function initPagination() {
    pagination.first.appendChild(
        createPageSwitchButton(1, "<<", false)
    );

    pagination.last.appendChild(
        createPageSwitchButton(amountOfPages, ">>")
    );
}

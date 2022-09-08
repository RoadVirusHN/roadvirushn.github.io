var wikilinks = document.querySelectorAll(".wikilink.externallink")
for (var i =0; i< wikilinks.length; i++) {
  wikilinks[i].addEventListener("click",  click_link);
  wikilinks[i].parentElement.addEventListener("mouseleave",  hover_out);
}
function click_link(e){
    e.preventDefault();
    e.target.nextElementSibling.style.visibility = "visible";
}

function hover_out(e){
  console.log(e.target.children)
  e.target.querySelector("span.link-warning-text").style.visibility = "hidden";
}

function hide_card(event: PointerEvent){
    var target = event.target! as HTMLElement;
    var card = target.parentNode?.nextSibling as HTMLElement;
    if (card.style.display == "none"){
        card.style.display = "block";
        target.innerText = "🔼";
    } else {
        card.style.display = "none";  
        target.innerText = "🔽";
    }    
}

function copy_content(event: PointerEvent){
    var target = event.target! as HTMLElement;
    var content = target.parentNode?.children.namedItem("content") as HTMLElement;

    navigator.clipboard.writeText(content.innerText);
    target.innerText = "✅";
    setTimeout(()=>{target.innerText= "📋";}, 500)

}
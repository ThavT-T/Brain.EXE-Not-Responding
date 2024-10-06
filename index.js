var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = document.getElementById('content');
      if (content.style.maxHeight){
        content.style.maxHeight = null;
        content.style.border = 'none';
        content.style.padding = '0px'
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.border = '2px white solid'
        content.style.padding = '5px'
      } 
    });
  }
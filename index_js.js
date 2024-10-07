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

var url = new URL("http://foo.bar/?x=1&y=2");

// If your expected result is "http://foo.bar/?x=1&y=2&x=42"
url.searchParams.append('x', 42);

// If your expected result is "http://foo.bar/?x=42&y=2"
url.searchParams.set('x', 42);

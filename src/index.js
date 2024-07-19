var head = document.getElementsByTagName("head")[0];

for (const weight of ["regular", "fill"]) {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href =
    "https://unpkg.com/@animaliads/animalia-icon@1.0.2/src/" +
    weight +
    "/style.css";
  head.appendChild(link);
}

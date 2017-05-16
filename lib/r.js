var less = require('postcss-less-engine');
var autoprefixer = require("autoprefixer");

const postcss = require("postcss");
let p = postcss();

p = p.use(
    less({ strictMath: true })
)
p = p.use(
    autoprefixer
)

p.process(`
  .foo {
    .bar {
	color: red;
    }
  }
`, { parser: less.parser })
  .then(function (result) {
console.log(result.css);
});

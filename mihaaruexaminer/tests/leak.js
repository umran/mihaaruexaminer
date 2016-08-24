function LeakingClass() {
}

var leaks = [];
setInterval(function() {
  for (var i = 0; i < 100; i++) {
    leaks.push(new LeakingClass);
  }

  console.error('Leaks: %d', leaks.length);
}, 1000);
var doSomeStuff = function(time) {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, time);
	});
};

console.log("Waiting 1 second");
doSomeStuff(1000).then(function() {
	console.log("Waiting 1 second and 10 seconds");
	return Promise.all([doSomeStuff(1000), doSomeStuff(10000)]);
}).then(function() {
	console.log("Done.");
}).catch(function(err) {
	console.error(err);
});
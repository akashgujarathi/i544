/**Prog for Web – HW-1
Name: Akash Gujarathi
B-Number: B00765802
*/
//solution 1]

function selectListsWithLengthMultiple(lists, multiple){
	return lists.filter(e=> (e.length % multiple) === 0)
}
//Solution 2]

function reverse(text) {
	return text.split("").reverse().join("");
}
//Solution 3]
 
function isPalindrome(text){
	return text.toLowerCase().replace(/\W+/g, '').split('').reverse().join('')===text.replace(/\W+/g, '');
}
//Solution 4]

function minLenArg(...objs){
	return (objs.reduce((acc, cV, cI, objs)=> cV.length < acc.length ? cV : acc))
}
//Solution 5] 

function formatInt(int, {base=10, n=3, sep=','} = {base: 10, n:3, sep: ','}){

  return int.toString(base).split("").reverse().reduce(function(acc, cV, cI){ 
	  (cI%n===0 && cI!=0) ? acc.push(cV.concat(sep)) : acc.push(cV) 
	  return acc}, []).reverse().join("")
}
//Solution 6] 

function isEvenParity(int){
	return ((int.toString(2).split('').reduce((acc,cV,cI)=> acc+cV)%2)===0)
}
//Solution 7]

function bitIndexesToInt(indexes){
	return indexes.reduce((acc,cV)=> acc+(2**cV),0)
}
//Solution 8]

function intToBitIndexes(int){
	return int.toString(2).split('').reverse().reduce(function(acc, cV, cI){ cV==='1' ? acc.push(cI) : acc.push()
		 return acc },[])
}
//Solution 9]

function multiIndex(obj, indexes){
	return indexes.split(".").reduce((acc,cV) => acc[cV] === null ? acc[cV] : acc=acc[cV], acc=obj)
}

//Solution 10] 

function zip(list1, list2){
	return list1.map(function(acc, cI){ return [acc, list2[cI]] })
}
//Solution 11]

function multiZip(...lists){
	
	return lists.length === 1 ? Array.from(lists).reduce(function(acc, cV){
		acc = (cV.reduce(function(acc_1, cV_1){ acc_1.push([cV_1]) 
			return acc_1 },[])) 
		return acc },[]) : Array.from(lists).reduce((a,b) => a.map((v, i) => v.toString().concat(b[i].toString()).split('').filter(e=> e!=',')))
}
//Solution 12]

function multiZipAny(...lists){
	return	lists.reduce((acc,cV)=> acc.length > cV.length ? acc=cV : acc).map((_,a) => lists.map((b) => b[a]))
}

/*Solution 13] 

1. If statement (results[key] == null) will result true even if the value of results[key] is undefined.
2. "==" is a lose equality and can lead to unknown results 
the better solution is if (results[key] === null) 
3. The three equal is superior to double equal as it will return true iif result[keys] is null

Solution 14]

	1. Factory Method: In JavaScript it is easy to implement compared to other languages as in javascript a function which returns a new is a factory function

	2. Prototype pattern: JavaScript is language that uses prototypal inheritance, rest all the other languages use classical inheritance 

	3. Singleton pattern: Making singleton class is easier in JavaScript just by using const to object and Object.freeze(obj) the class turns into a singleton


//Solution 15]
//A]
//https://medium.com/@thejasonfile/es5-functions-vs-es6-fat-arrow-functions-864033baa1a
 The fat arrow in the class properties won’t be in the prototype hence can’t be used 

B] 
function Rect(x, y, w, h) {
   //   this.x = x; this.y = y;
modified version Shape.call(this,x,y)
      this.width = w; this.height = h;
    }
*/ 
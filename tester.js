
export function equals(a, b) {
	if (typeof a != typeof b) return false;
    for (const key in a) {
		if (typeof a[key] == 'function') continue;
        if (typeof b[key] == 'undefined') return false;
        if (typeof a[key] == 'object') {
            if (!equals(a[key], b[key])) return false;
		} else if (b[key] != a[key]) return false;
    }
    for (const key in b) {
		if (typeof b[key] == 'function') continue;
        if (typeof a[key] == 'undefined') return false;
        if (typeof b[key] == 'object') {
            if (!equals(b[key], a[key])) return false;
		} else if (a[key] != b[key]) return false;
    }
    return true;
}

const tests = []; let failed = false, passed = 0, total = 0;
/// run a test and log its result
export function test(name, f, disabled = false) {
	if (disabled) return;
	if (tests.length == 0) failed = false;
	tests.push(name);
	total++;
	try {
		f();
		if (tests.length == 1 && failed) throw 'inner testing went wrong';
		console.log(`%ctest ${tests.join(' -> ')} passed!`, 'color: green');
		passed++;
	} catch (e) {
		if (tests.length > 0) failed = true;
		console.log(`%ctest ${tests.join(' -> ')} failed!`, 'color: red');
		console.log(e);
	}
	tests.pop();
}

/// assert the passed function / value to
/// be true, throws an error if otherwise
export function assert(f) {
	if (typeof f != 'boolean') f = f();
	if (!f) throw 'assertion failed';
}

/// assert the passed function / value to
/// be false, throws an error if otherwise
export function reject(f) {
	if (typeof f != 'boolean') f = f();
	if (f) throw 'rejection failed';
}

export function expect(data) {
	return {
		data,
		to: f => { if (!f(data)) throw 'unexpected behaviour'; },
		toBe: expected => {
			if (data !== expected)
				throw `expected instance of ${expected}, got ${data}`;
		},
		toEqual: expected => {
			if (!equals(data, expected))
				throw `expected ${JSON.stringify(expected)}, got ${JSON.stringify(data)}`;
		},
		toBeNot: expected => {
			if (data === expected)
				throw `expected not ${expected}, got ${data}`;
		} 
	};
}

export function results() {
	const color = passed / total > 0.5 ? 'green' : 'red';
	console.log(`%c${passed} / ${total} tests passed!`, 'color: ' + color);
}

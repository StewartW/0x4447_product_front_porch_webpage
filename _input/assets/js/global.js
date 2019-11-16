//
//	Convert base64/URLEncoded data in to an Array.
//
function base64_to_blob(data)
{
	//
	//	Variables where decoded string will be stored.
	//
	let byte_string;

	//
	//	Check if it's base64 and decode it if so.
	//
	if(data.split(',')[0].indexOf('base64') >= 0)
	{
		byte_string = atob(data.split(',')[1]);
	}

	//
	//	If it's not a base64 encoding, the unescape the string.
	//
	if(data.split(',')[0].indexOf('base64') === 0)
	{
		byte_string = unescape(data.split(',')[1]);
	}

	//
	// Separate out the mime part from the string.
	//
	let mime_string = data.split(',')[0].split(':')[1].split(';')[0];

	//
	//	Object represents chars corresponding bytes.
	//
	let ia = new Uint8Array(byte_string.length);

	//
	//	Write the bytes of the string to a typed array
	//
	for(let i = 0; i < byte_string.length; i++)
	{
		ia[i] = byte_string.charCodeAt(i);
	}

	//
	//	->	Return a blob that S3 can understand.
	//
	return new Blob([ia], { type: mime_string });
}

//
//	Convert a Uint8Array in to a Base64 object. Why we don't use the build in
//	btoa(), because it overfills the stack for whatever reason.
//
function blob_to_base64(data)
{
	//
	//	1.	Loop over the array and concatenate all the numbers in to a string.
	//
	let str = data.reduce(function(accumulator, value) {

		return accumulator + String.fromCharCode(value);

	}, '');

	//
	//	->	Return the result
	//
	return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
}

//
//  COnvert an Array buffer to a String.
//
function array_buffer_to_string(data)
{
    return String.fromCharCode.apply(null, new Uint16Array(data));
}

//
//  Convert a String to an Array Buffer.
//
function string_to_array_buffer(str)
{
    //
    //  2 bytes for each char
    //
    let data = new ArrayBuffer(str.length * 2);
    let dataView = new Uint16Array(data);

    for(let i = 0, strLen = str.length; i < strLen; i++)
    {
        dataView[i] = str.charCodeAt(i);
    }

    return data;
}

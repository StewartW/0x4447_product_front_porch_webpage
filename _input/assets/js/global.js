//
//	Populate the form as is.
//
function populate_form(data)
{
	for(let key in data)
	{
		$('#' + key).val(data[key]);
	}
}

//
//	Convert base64/URLEncoded data in to an Array.
//
function base64_to_blob(data_uri)
{
	//
	//	Variables where decoded string will be stored.
	//
	let byte_string;

	//
	//	Check if it's base64 and decode it if so.
	//
	if(data_uri.split(',')[0].indexOf('base64') >= 0)
	{
		byte_string = atob(data_uri.split(',')[1]);
	}

	//
	//	If it's not a base64 encoding, the unescape the string.
	//
	if(data_uri.split(',')[0].indexOf('base64') === 0)
	{
		byte_string = unescape(data_uri.split(',')[1]);
	}

	//
	// Separate out the mime part from the string.
	//
	let mime_string = data_uri.split(',')[0].split(':')[1].split(';')[0];

	//
	//	Object represents chars corresponding bytes.
	//
	let ia = new Uint8Array(byte_string.length);

	//
	//	Write the bytes of the string to a typed array
	//
	for(var i = 0; i < byte_string.length; i++)
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
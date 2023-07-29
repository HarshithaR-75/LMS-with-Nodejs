
function validate()
{
strValidate=strForm.str.value.search(/1BM[0-9]{2}[A-Z]{2}[0-9]{3}/i);
if(strValidate== -1)
{
alert("Not Valid");
}
alert("Valid");
}

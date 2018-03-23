
function testConn()
{
    console.log('Testing Connection Stage 1.');
    setTimeout(testConn, 1000);
}

testConn();
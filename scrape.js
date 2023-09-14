const puppeteer = require('puppeteer');
function scrape (url) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({args:['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            await page.goto(url);
            let urls = await page.evaluate(() => {
                let results;
                let numbers =["1","2","3","4","5","6","7","8","9","0"]
                let new_result=""
                var currency = ""
                let product_title = ""
                let items = document.querySelectorAll('span.-b.-ltr.-tal.-fs24.-prxs');
                let title = document.querySelectorAll('.-fs20.-pts.-pbxs');
                title.forEach((item)=>{
                    product_title = item.innerText;
                })
                items.forEach((item) => {
                    currency = item.innerText[0];
                    var temp_result = item.innerText.replace("₦","");
                    for(var i=0;i<temp_result.length;i++){
                        if(temp_result[i]in numbers){
                            new_result+=temp_result[i]
                        }
                    }
                    results = {
                        title : product_title,
                        price:  parseInt(new_result),
                        currency : currency
                    }
                });
                return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

module.exports = scrape;






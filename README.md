# Stock Anna #
### Purpose  ###
 - Crawl  yahoo stock market data and news
 - Visualize the NASDAQ market (in demo is only 2014 but crawler can do more) based on size in its industry and the market as a whole.
 - Visualize individual companies' stock data and their news
 - Allow users to browse for correlation between news and stock data
 - Allow users to use technical analysis on the stock data from the company of interest
### Visualization ###
![Industry level](https://raw.githubusercontent.com/napcrisis/AppAnna/master/screenshot/industry.png "AppAnna Industry Overview")
Treemap - Allow quick identification of critical players in industry and whether they are doing well
 - Coloring of treemap is by increase in stock prices over time
 - Size of treemap is sorted from big to small
 - Treemap boxes squarified to improve visual understanding of data

![Company level](https://raw.githubusercontent.com/napcrisis/AppAnna/master/screenshot/company.png "AppAnna Company review")
Chart - Multiple technical analysis tools made available including
 - Simple Moving Averages (10 and 20 days)
 - Expotential moving averages (50 days) 
These are common technical analysis tools. We also use other data visualization like line, candlestick, barchart
 - Candlestick is commonly used for stock data so it should be intuitive and comfortable for experienced investors
 - Barchart is used to indicate transaction volume 
The last is the vertical colored lines which indicates the date which the news occurred. This tool, attempts to allow users to find correlation between news and stock data
### DEMO ###
Visit: http://sleep.strangled.net/is428/

### Setup local copy  ###

* Install MAMP/WAMP depending on your operating system.
* download & install git-scm with default settings
* setup ur key - http://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key
* copy id_rsa.pub's content in home folder/.ssh and paste into bitbucket account's ssh key
* go to ur WAMP/MAMP's web folder. my windows's web folder is at C:\wamp\www\
* right click and open a git bash. Type git clone git@bitbucket.org:napcrisis/is428.git
* Create a new database called "newssources" and import the mysql file in setup folder. Remember to click newssources database first before importing.

### How to view the application ###
* Start your server e.g. XAMPP. Go to http://localhost/is428/index.php and you should see a proper treemap. 
* if you face issue using git clone git@bitbucket.org, just download a copy
*
* if you face more problems, please email Tommy.soh.2011@smu.edu.sg for assistance
[Wiki](https://wiki.smu.edu.sg/1415t1is428/Anna%27s_kakia_Proposal)

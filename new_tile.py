import bs4

def new_html_section(id, title):
    idd = id
    html_string = f'''
            <!-- Tile front -->
             <section onclick="draw_line('{idd}.json', '{idd}', 'percent')">
                      <div class="bl-box">
                              <h2 class="bl-icon top" id="{idd}"></h2>
                              <h2 class="bl-icon middle" id="{idd}_api"></h2>
                              <h2 class="bl-icon bottom" id="{idd}_date"></h2>
                      </div>

                     <!-- Tile back -->
                     <div class="bl-content">
                             <h2> {title} </h2>
                             <div id='{idd}_chart'> </div>
                             <div id ='{idd}_source'></div>
                     </div>
                     <span class="bl-icon bl-icon-close close"></span>
              </section>
    '''
    return html_string

def newHTML(filename, replace = False):
    html_string = new_html_section('test', 'test')
    soup_string = bs4.BeautifulSoup(html_string, "html.parser")

    html_report_part1 = open(filename,'r').read()
    soup = bs4.BeautifulSoup(html_report_part1, "html.parser")
    soup.findAll("div", {"class": "bl-main"})[0].append(soup_string)

    if replace:
        with open("index.html", "wb") as f_output:
            f_output.write(soup.prettify("utf-8"))  
    else:
        with open("example_modified.html", "wb") as f_output:
            f_output.write(soup.prettify("utf-8"))  

if __name__ == '__main__':
    newHTML('index.html')
# # load the file
# with open("index.html", 'r+') as inf:
#     txt = inf.read()
#     soup = bs4.BeautifulSoup(txt, features="html.parser")
#     soup_string = bs4.BeautifulSoup(html_string)
#     soup.findAll("div", {"class": "bl-main"})[0].append(soup_string)
#     print(soup)  
#     inf.write(str(soup))  
# # print(soup)

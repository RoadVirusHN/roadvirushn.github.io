def regex_replace_obsidian_wikilink(str, posts, page)
    #1. 다른 포스트에서 가져오면 링크로 변경 - [x]
    #2. 현재 포스트에서 가져오면 #으로 시작하는 href
    #  - 포스트명이 현재 포스트명과 같거나 존재하지 않을 경우 현재 포스트명
    #3. href 특수문자 지우기
    #4. href 띄어쓰기는 -로 바꾸기
    #5. alt text가 있다면 alt text 기입 없다면 캡처 그룹 1과 2번을 합한 후 #을 "> "으로 가져오기
    #  - 이때 할 수 있다면 특수문자와 띄어쓰기가 변경되기 전의 이름으로

    obsidianLinkTagRegex = /<p>\[\[([^(http)#\|\]]*)?(http[^\|\]]*)?([^\]\|]*(\#[^\#\]\|]+))?(\|([^\#\|\]]*))?\]\]<\/p>/
    # capture group list(all nullable)
    # $1: post name
    # $2: http url
    # $3: original headings url ex) #H1##H2###H3
    # $4: lowest headings url with a '#'. ex) #H3
    # $5: alt text with a '|'.
    # $6: alt text only.

    return str.gsub(obsidianLinkTagRegex){ |matched|

        if !$2 && !$1 || page.title == $1 
            if $4
                href=$4
            else
                href='#'
            end
        elsif $2
            href = $2
        elsif $4
            href = $4
        else
            href = '#'
        end

        if $6
            text = $6   
        elsif $1
            text = $1 + $3
        elsif $2
            text = $2
        else
            text = "[[]]"
        end
        puts(href)
        matched = '<a href="%s">%s</a>' % [href.downcase.gsub(/[$&+,:;=?@|'<>\.^*()%!]+/, '').gsub(' ', '-'),text.sub(/^#/, '').gsub(/#+/,'> ')]
    }
end

def regex_replace_md_wikilink(str, posts, page)    
    markdownLinkTagRegex = /\[(.*)\]\(([^\#].*)?(\#.*(\#+[^\#]*))?\)/
      # capture group list(all nullable)
      # $1: alt text
      # $2: http url
      # $3: original headings url
      # $4: lowest headings url with a '#'. 

    return str.gsub(markdownLinkTagRegex){ |matched|
        if !$2 && !page
            if $4
                href=$4
            elsif
                href=page.url
            end
        elsif $2
            href = $2
        else
            href = '#'
        end

        if $6
            text = $6   
        elsif $1
            text = $1 
        elsif $3
            text = $3
        elsif $2
            text = $2
        else
            text = "[[]]"
        end

        return '<a href="%s">%s</a>' % [href,text]
    }
end
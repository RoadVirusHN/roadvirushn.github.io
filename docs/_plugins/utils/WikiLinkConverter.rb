module WikiLinkConverter
    OBSIDIAN_LINK_REGEX = /(?<!!)\[\[((?!https?:\/\/)[^\]\|\#]*)?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))?([^\]\|]*(\#[^\#\]\|]+))?(?:\|([^\#\|\]]*))?\]\]/
    MD_LINK_REGEX = /[^!]\[(.*)\]\((https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))?(\#+[^\]\)\#]*)?\)\[(.*)\]\(([^\#].*)?(\#.*(\#+[^\#]*))?\)/

    def build_a_tag(href, innerText) return '<a href="%s">%s</a>' % [href, innerText + "🔗"] end

    def raw_headings_to_innertext(string) return string&.sub(/^#/, '')&.gsub(/#+/, '> ') end
    
    def raw_headings_to_href(string) 
        return string&.downcase&.gsub(/[$&+,:;=?@|'<>\.^*()%!]+/, '')&.gsub(' ', '-')&.gsub(/#+/, '#') 
    end
    
    def link_to_other_post(posts, postName, targetHeading)
        for post in posts do
            if post['title'] == postName
                return post.url + (raw_headings_to_href(targetHeading) || "")
            end        
        end
        return "#{postName} : No such a post in your '_posts' folder."
    end

    def wikilink_obsidian_to_kramdown(str, posts, page)        
        return str.gsub(OBSIDIANLINKREGEX){ |matched|
            postName = $1
            externalURL = $2
            rawHeadings = $3 
            targetHeading = $4
            altText = $5

            # Set innerText of <a> tag. the alt text has a top priority, and then url, last one is href value.
            innerText = altText || externalURL || raw_headings_to_innertext(postName || '' + rawHeadings || '') || 'Empty Link'

            isCurrentPost = postName ? page['title'] == postName : externalURL.match(page.url)
            
            # Set href property of <a> tag. Check the outlink post name, then Link to desired headings.
            href = externalURL || (isCurrentPost ? (raw_headings_to_href(rawHeadings) || "#") : link_to_other_post(posts,postName,targetHeading))
            
            matched = build_a_tag(href, innerText)
        }
    end

    def wikilink_md_to_kramdown(str, posts, page) 
        return str.gsub(MDLINKREGEX){ |matched|
            altText = $1
            externalURL = $2
            targetHeading = $3 

            innerText = altText || externalURL || targetHeading || 'Empty Link'
            
            href = externalURL || targetHeading || "#"
            
            matched = build_a_tag(href, innerText)
        }
    end
end
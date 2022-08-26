module PreprocessWikiLink
    OBSIDIAN_LINK_REGEX = /(?<!!)\[\[((?!https?:\/\/)[^\]\|\#]+)?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*))?([^\]\|\)]*(\#[^\#\]\|]+))?(?:\|([^\#\|\]]*))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*$)/
    MARKDOWN_LINK_REGEX = /(?<!!)\[([^\#\|\]]+)?\]\(((?!https?:\/\/)[^\]\|\#]*)?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@\:%_\+.~\#?&\/=]*))?([^\]\|\)]*(\#[^\#\]\|]+))?\)(?=[^`]*(?:`[^`]*`[^`]*)*$)/

    def convert_wiki_link(site, post)  
        return post.content
        .gsub(MARKDOWN_LINK_REGEX){ |matched|
            # why the empty string are coming out from unmatched results?
            if $2 == "" || $2 == nil
               postName = nil 
            else
                # Don't touch capture group value directly like this => ($2&.gsub("%20", ' '))
                # It will cause misterious result to other capture group values like $4, $5 etc...
                postName = $2 
                postName = postName.gsub('%20', ' ')
            end
            
            linkData = { 
                altText: $1,
                postName:postName,
                externalURL: $3,
                rawHeadings: $4,
                targetHeading: $5
            }
            matched = build_markdown_link(linkData, site, post)
        }
        .gsub(OBSIDIAN_LINK_REGEX){ |matched|  
            matched = build_markdown_link({
                altText: $5,
                postName: $1,
                externalURL: $2,
                rawHeadings: $3,
                targetHeading: $4
            }, site, post)
        }
    end
    
    def build_markdown_link(linkData, site, post) 
        # Destructuring Hash to each variables.
        altText, externalURL, postName, rawHeadings, targetHeading = 
            linkData.values_at(:altText, :externalURL, :postName, :rawHeadings, :targetHeading)
        puts linkData
        # Set innerText of <a> tag by priorities.
        innerText = \
            altText \
            || externalURL \
            || raw_headings_to_innertext((postName || '') + (rawHeadings || '')) \
            || 'Empty Link'
        isInternalLink = postName ? post['title'] == postName : (targetHeading || externalURL&.match(post.url))
        # Set href property of <a> tag. Check the outlink post name, then Link to desired headings.
        href = \
            externalURL \
            || (isInternalLink \
                ? (raw_headings_to_href(rawHeadings) || "#") \
                : link_to_other_post(site.posts,postName,targetHeading))
            
        return '[%s](%s)' % [innerText || "🔗", href]    
    end

    def raw_headings_to_innertext(string) return string&.sub(/^#/, '')&.gsub(/#+/, '> ') end
    
    def raw_headings_to_href(string) 
        return string&.downcase&.gsub(/[$&+,:;=?@|'<>\.^*()%!]+/, '')&.gsub(' ', '-')&.gsub(/#+/, '#') 
    end
    
    def link_to_other_post(posts, postName, targetHeading)
        post = posts.docs.filter{ |doc| doc['title']==postName }
        if post.length() > 1
            return raise "ERROR post title: #{postName} => Duplicated posts."
        elsif post.length() == 1
            return post[0].url + (raw_headings_to_href(targetHeading) || "")
        else
            return raise "ERROR post title: #{postName} => No such a post in your website."
        end
    end
end
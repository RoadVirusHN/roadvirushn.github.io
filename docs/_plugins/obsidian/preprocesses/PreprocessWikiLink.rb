module PreprocessWikiLink
    OBSIDIAN_LINK_REGEX = /(?<!!)\[\[((?:(?!https?:\/\/).*\/)?(?:([^\|\/\^\#\*\?\]\[]+)))?((?:(?:\#[^#\]\[\)\|]*(?![\|\]]))*(\#[^\)\]\|]*)?)?)?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@\:%_\+.~\#?&\/=]*))?(?:\|([^\#\|\]\[]+))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*\Z)/
    MARKDOWN_LINK_REGEX = /(?<!!)\[([^\#\|\]]+)?\]\((?:(?:(?!https?:\/\/).*\/)?(?:(?:([^\|\/\^\#\*\?\]\[\.]+)(?:.[a-z]{2,3})?))?((?:(?:\#[^#\`\)\(]+?)+?(?!\)))?(\#[^#\`\)\(]+)?)?)?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@\:%_\+.~\#?&\/=]*))?\)(?=[^`]*(?:`[^`]*`[^`]*)*\Z)/

    def convert_wiki_link(site, post)
        return post.content
        .gsub(MARKDOWN_LINK_REGEX){ |matched|            
            matched = build_markdown_link({ 
                altText: $1,
                postName: $2&.gsub('%20', ' '),
                rawHeadings: $3,
                targetHeading: $4,
                externalURL: $5
            }, site, post)
        }
        .gsub(OBSIDIAN_LINK_REGEX){ |matched|  
            matched = build_markdown_link({
                altText: $6,
                postName: $2,
                externalURL: $5,
                rawHeadings: $3,
                targetHeading: $4
            }, site, post)
        }
    end
    
    def build_markdown_link(linkData, site, post) 
        # Destructuring Hash to each variables.
        altText, externalURL, postName, rawHeadings, targetHeading = 
            linkData.values_at(:altText, :externalURL, :postName, :rawHeadings, :targetHeading)
        # Set innerText of <a> tag by priorities.
        innerText = \
            altText \
            || externalURL \
            || raw_headings_to_innertext((postName || '') + (rawHeadings || '')) \
            || 'Empty Link'
        isInternalLink = postName ? post['title'] == postName : (targetHeading || externalURL&.include?(post.url))

        # Set href property of <a> tag. Check the outlink post name, then Link to desired headings.
        href = \
            externalURL \
            || (isInternalLink \
                ? (raw_headings_to_href(rawHeadings) || "#") \
                : link_to_other_post(site.posts, postName, targetHeading))
            
        return '[%s](%s)' % [innerText || "🔗", href]    
    end

    def raw_headings_to_innertext(string) return string&.sub(/^#/, '')&.gsub(/#+/, '> ') end
    
    def raw_headings_to_href(string) 
        return string&.downcase&.gsub(/^#+ +/, '')&.gsub(/[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+$/, '')&.gsub(/^[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+/, '')&.gsub(/[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+/, '-')
    end
    
    def link_to_other_post(posts, postName, targetHeading)
        post = posts.docs.filter{ |doc| 
            doc['title']==postName || doc.basename.gsub(doc.extname, '')==postName
        }
        if post.length() > 1
            return raise "ERROR post title: #{postName} => Duplicated posts."
        elsif post.length() == 1
            return post[0].url + (raw_headings_to_href(targetHeading) || "")
        else
            return raise "ERROR post title: #{postName} => No such a post in your website."
        end
    end
end
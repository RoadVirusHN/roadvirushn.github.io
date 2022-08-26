module PreprocessImageLink 
    OBSIDIAN_IMAGE_LINK_REGEX = /!\[\[(?:(?!https?:\/\/)(?:.*\/)?([^\[\]\|]+\.[a-z]{3,4}))??(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*))?(?:\|(.*))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*$)/
    MARKDOWN_IMAGE_LINK_REGEX =  /!\[(?:([^\[\]\|]*))?\]\((?:(?!https?:\/\/)(?:.*\/)?([^\[\]\|]+\.[a-z]{3,4}))?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*))?\)(?=[^`]*(?:`[^`]*`[^`]*)*$)/

    def build_markdown_img(linkData, static_dir) 

        staticImgDir = static_dir + '/' + (linkData['staticImgfile'] || '')

        src = linkData['externalURL'] || staticImgDir

        return '![%s](%s)' % [linkData['altText'],src] 
    end
    def convert_image_link(post)  
        static_dir = '/' + Jekyll.configuration({})['static_img_dir'] + '/' + post.date.strftime("%Y-%m-%d") + '-' + post['slug'] 
        return post.content
        .gsub(MARKDOWN_IMAGE_LINK_REGEX){ |matched|
            if $2 == "" || $2 == nil
               staticImgfile = nil 
            else
                # Don't touch capture group value directly like this => ($2&.gsub("%20", ' '))
                # It will cause misterious result to other capture group values like $1, $3 etc...
                staticImgfile = $2 
                staticImgfile = staticImgfile.gsub('%20', ' ')
            end

            matched = build_markdown_img({
                altText: $1,
                staticImgfile: staticImgfile,
                externalURL: $3
            }, static_dir)
        }
        .gsub(OBSIDIAN_IMAGE_LINK_REGEX){ |matched|
            matched = build_markdown_img({
                staticImgfile: $1,
                externalURL: $2,
                altText: $3
            }, static_dir)
        }
    end
end
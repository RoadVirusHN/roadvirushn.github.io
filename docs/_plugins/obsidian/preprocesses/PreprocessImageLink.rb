module PreprocessImageLink 
    OBSIDIAN_IMAGE_LINK_REGEX = /!\[\[(?:(?!https?:\/\/)(?:.*\/)?([^\[\]\|]+\.[a-z]{3,4}))??(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*))?(?:\|(.*))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*$)/
    MARKDOWN_IMAGE_LINK_REGEX =  /!\[(?:([^\[\]\|]+))?\]\((?:(?!https?:\/\/)(?:.*\/)?([^\[\]\|]+\.[a-z]{3,4}))?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*))?\)(?=[^`]*(?:`[^`]*`[^`]*)*$)/

    def build_markdown_img(linkData, static_dir) 

        staticImgDir = static_dir + '/' + (linkData[:staticImgFile] || '')

        src = linkData[:externalURL] || staticImgDir

        return '![%s](%s)' % [linkData[:altText], src] 
    end

    def convert_image_link(post)  
        static_dir = '/' + Jekyll.configuration({})['static_img_dir'] + '/' + post.date.strftime("%Y-%m-%d") + '-' + post['slug'] 
        return post.content
        .gsub(MARKDOWN_IMAGE_LINK_REGEX){ |matched|
            matched = build_markdown_img({
                altText: $1,
                staticImgFile: $2&.gsub('%20', ' '),
                externalURL: $3
            }, static_dir)
        }
        .gsub(OBSIDIAN_IMAGE_LINK_REGEX){ |matched|
            matched = build_markdown_img({
                staticImgFile: $1,
                externalURL: $2,
                altText: $3
            }, static_dir)
        }
    end
end
module ImageLinkConverter 
    DEFAULT_STYLE = "display: block; width: 50%; margin: auto"
    OBSIDIAN_IMAGE_LINK_REGEX = /!\[\[((?!https?:\/\/)[^\[\]\|]+\.[a-z]{3,4})?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))?(?:\|(.*))?\]\]/

    def build_img_tag(src, altText, style) return '<img src="%s" alt="%s" style="%s" />' % [src, altText,style] end

    def imagelink_obsidian_to_kramdown(str, static_dir)        
        return str.gsub(OBSIDIAN_IMAGE_LINK_REGEX){|matched|
            staticImgfile = $1
            externalURL = $2
            altText = $3
            
            staticImgDir = static_dir + '/' +staticImgfile || '' 

            src = externalURL || staticImgDir

            matched = build_img_tag(src, altText, DEFAULT_STYLE)
        }

    end
end
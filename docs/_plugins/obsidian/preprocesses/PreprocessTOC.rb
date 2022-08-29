module PreprocessTOC
    OBSIDIAN_TOC_REGEX = /(?:\[TOC\]|(?:* TOC\n\{:toc\})(?=[^`]*(?:`[^`]*`[^`]*)*\Z)/i
    MARKDOWN_HEADINGS = /(?<headings>^#+[^#\n]+(?=[^`]*(?:`[^`]*`[^`]*)*\Z))/

    def convert_toc_formats(str)
        return generate_headings_id(str.gsub(OBSIDIAN_TOC_REGEX){ |matched|
            matched = "```TOC\n```"
        })
    end

    def text_to_custom_id(str)
        return str.downcase.gsub(/^#+ +/, '').gsub(/[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+$/, '')&.gsub(/^[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+/, '')&.gsub(/[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+/, '-') 
    end

    def generate_headings_id(str)
        return str.gsub(MARKDOWN_HEADINGS) { |matched| 
            custom_id = text_to_custom_id(headings)
            matched = "#{$headings}\n{: ##{custom_id}}"  
        }
    end
end
module PreprocessTOC
    OBSIDIAN_TOC_REGEX = /(?:\[TOC\]|```toc[^`]*```)(?=[^`]*(?:`[^`]*`[^`]*)*\Z)/i
    MARKDOWN_HEADINGS = /(^#+[^#\n]+(?=[^`]*(?:`[^`]*`[^`]*)*\Z))/
    def convert_TOC(str)
        return generate_headings_id(str.gsub(OBSIDIAN_TOC_REGEX) { |matched|
            matched = "* TOC\n{:toc}"
        })
    end

    def generate_headings_id(str)
        return str.gsub(MARKDOWN_HEADINGS) { |matched| 
            headings = $1
            custom_id = headings.downcase.gsub(/^#+ +/, '').gsub(/[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+$/, '')&.gsub(/^[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+/, '')&.gsub(/[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+/, '-')
            matched = "#{headings}\n{: ##{custom_id}}"
        }
    end
end
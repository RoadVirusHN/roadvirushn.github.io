module PreprocessTOC
    OBSIDIAN_TOC_REGEX = /\[TOC\]|```toc[^`]*```/i

    def convert_TOC(str)
        return str.gsub(OBSIDIAN_TOC_REGEX) { |matched|
            matched = "* TOC\n{:toc}"
        }
    end
end
module PostprocessTOC
    NO_ID_HEADINGS_REGEX = /<h(?<headings>[123456])>(?<title>.*)<\/h[123456]>(?=[^`]*(?:`[^`]*`[^`]*)*\Z)/
    OBSIDIAN_TOC_REGEX = /```toc\n*(?:(?:style|min_depth|max_depth|title|allow_inconsistent_headings|delimiter|varied_style): (?:.*)\n*)*?\n*```\n/i
    TOC_CONFIG_REGEX = /(?<key>style|min_depth|max_depth|title|allow_inconsistent_headings|delimiter|varied_style): (?<value>.*)/
    HEADINGS_REGEX = /<h(?<level>\d)[^>]*(id="(?<id>[a-z_-#]*)")[^>]*>(?<innerText>[^<]*)<\/h\d>(?=[^`]*(?:`[^`]*`[^`]*)*\Z)/

    class Heading
        @@toc= []
        def initialize(level, id, innerText)
            @level = level
            @id = id
            @innerText = innerText
            @childs = []
            @parent = nil
            @@toc.push(self)
        end

        def append_child(child)
            @childs.push(child)
        end

        def set_parent(parent)
            @parent = parent
        end
    end
    
    
    def text_to_id_format(str) 
        return str.gsub(/[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+$/, '')&.gsub(/^[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+/, '')&.gsub(/[!@$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/? ]+/, '-') 
    end

    def get_config_from_raw_toc(toc) 
        config = {
            style: "bullet",
            min_depth: 2,
            max_depth: 6,
            title: nil,
            allow_inconsistent_headings: false,
            delimiter: "|",
            varied_style: false,
            indent: 2
        }

        toc.gsub(TOC_CONFIG_REGEX){|matched|
            config[key] = value
        }
        return config
    end
    
    def get_headings_data(str)
        h1s = []
        upper_tag = nil
        str.gsub(HEADINGS_REGEX){ |matched|
            heading = Heading.new($level, $id, $innerText)
            if $level == 1 
                h1s.push(heading)
                upper_tag = heading
                next
            end
            if upper_tag.level > heading.level
                parent = upper_tag
            elsif upper_tag.level == heading.level
                parent = upper_tag.parent
            
            end
            heading.set_parent(parent)
            parent.append_child(parent)
            upper_tag = heading
            Heading.toc.push(heading)

        }
        return h1s
    end

    def convert_toc(str)
        headings = get_headings_data(str)
        return str.gsub(OBSIDIAN_TOC_REGEX){ |toc|
            config = get_config_from_raw_toc(toc)
            toc = build_toc(config, headings)
        }
    end

    def build_toc(config, headings)
        result = ''
        return result
    end
end 

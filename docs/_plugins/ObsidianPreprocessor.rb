require_relative "./obsidian/preprocesses/PreprocessImageLink"
require_relative "./obsidian/preprocesses/PreprocessWikiLink"
require_relative "./obsidian/preprocesses/PreprocessTOC"

module ObsidianPreprocessor
    class ObsidianConverter < Jekyll::Generator
        safe true

        def generate(site)
            for doc in site.posts.docs
                if doc['layout'] == 'obsidian'
                    doc = self.preprocess(site, doc)
                end                
            end
        end

        include PreprocessImageLink
        include PreprocessWikiLink
        include PreprocessTOC
        def preprocess(site, post)
            post.content = convert_image_link(post)
            post.content = convert_wiki_link(site, post)
            post.content = convert_TOC(post.content)
            return post
        end
    end
end
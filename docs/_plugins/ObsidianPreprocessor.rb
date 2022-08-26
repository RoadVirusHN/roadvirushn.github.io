require_relative "./obsidian/preprocesses/PreprocessImageLink"
require_relative "./obsidian/preprocesses/PreprocessWikiLink"

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
        def preprocess(site, post)
            post.content = convert_image_link(post)
            post.content = convert_wiki_link(site, post)
            return post
        end
    end
end
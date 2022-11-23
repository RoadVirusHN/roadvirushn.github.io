require 'liquid'

module Jekyll
  module Postprocessor
    # There's no features at right now. but I will implement common features for all docs.
    # ex) profanity filters, hashtag etc...
    def postprocess(str)
      str
    end

  end
end

Liquid::Template.register_filter(Jekyll::Postprocessor)

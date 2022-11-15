require 'liquid'

module Jekyll
  module Postprocessor

    def postprocess(str)
      str
    end

  end
end

Liquid::Template.register_filter(Jekyll::Postprocessor)

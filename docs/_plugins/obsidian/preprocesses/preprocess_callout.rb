module PreprocessCallout
  # Preprocessing for callout.

  CALLOUT_REGEX = /(?<front_tag>```ad-(?<type>[a-zA-Z]*))\n(?:(?:title: (?<title>.*)\n)?(?:collapse: (?<collapse>.*)\n)?(?:copy: (?<copy>.*)\n)?)?(?<content>[\s\S]*?)(?<back_tag>```)\n/.freeze

  def decouple_callout(str)
    # decouple callout tags to render inside codes.
    str.gsub(CALLOUT_REGEX) do |_matched|
      type = Regexp.last_match(2)
      title = Regexp.last_match(3)
      collapse = Regexp.last_match(4)
      copy = Regexp.last_match(5).nil? ? '' : 'c'
      content = Regexp.last_match(6)
      collapse = collapse == 'open' ? '+' : '-' unless collapse.nil?
      "\n<!-- #@#callout-#{type}#@##{title}#@##{collapse}#{copy} -->\n#{"title: #{title}\n\n" if title}#{content}\n<!-- @#@-#{type}@#@#{title}@#@ -->\n\n"
    end
  end
end

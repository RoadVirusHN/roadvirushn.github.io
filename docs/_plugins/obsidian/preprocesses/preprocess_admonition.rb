module PreprocessAdmonition
  # Preprocessing for admonition.

  ADMONITION_REGEX = /(?<front_tag>```ad-(?<type>[a-zA-Z]*))\n(?:(?:title: (?<title>.*)\n)?(?:collapse: (?<collapse>.*)\n)?(?:copy: (?<copy>.*)\n)?)?(?<content>[\s\S]*?)(?<back_tag>```)\n/.freeze

  def decouple_admonition(str)
    # decouple admonition tags to render inside codes.
    str.gsub(ADMONITION_REGEX) do |_matched|
      type = Regexp.last_match(2)
      title = Regexp.last_match(3)
      collapse = Regexp.last_match(4)
      copy = Regexp.last_match(5).nil? ? '' : 'c'
      content = Regexp.last_match(6)
      collapse = collapse == 'open' ? '+' : '-' unless collapse.nil?
      "\n<!-- #@#admonition-#{type}#@##{title}#@##{collapse}#{copy} -->\n#{content}\n<!-- @#@-#{type}@#@#{title}@#@ -->\n\n"
    end
  end
end

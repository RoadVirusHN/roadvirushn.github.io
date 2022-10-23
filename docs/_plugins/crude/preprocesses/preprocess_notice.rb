require_relative '../../obsidian/postprocesses/postprocess_callout'
module PreprocessNotice
  include PostprocessCallout
  def add_notice(str)
    prefix = "<style>div.post-content.e-content {  background-color: #f9fd85; border-radius: 15px; padding: 8px;}</style>\n"
    prefix += build_callout({ type: 'warning',
                              title: '',
                              content: '<strong>미완성 포스트입니다.</strong> 추가적인 내용 추가, 변경 및 정리가 예정되어 있습니다.',
                              emoji: '🛠️' })
    puts prefix
    prefix + str
  end
end

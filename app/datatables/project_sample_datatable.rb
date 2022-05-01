class ProjectSampleDatatable < ApplicationDatatable
  private

  def data
    samples.map do |sample|
      [].tap do |column|
        column << ""
        @config.each do |attr|
          if attr != 'id'
            column << "<div class='table_cell'> #{sample[attr]} </div>"
          else
            column << sample[attr]
          end
        end
        column << link_to('Show', "1/samples/2")
      end
    end
  end

  def count
    samples.length()
  end

  def total_entries
    @obj.length()
    # will_paginate
    # users.total_entries
  end

  def samples
      fetch_samples
  end

  def fetch_samples
    search_string = []
    @config.each do |attr|
      # if Sample.columns_hash[attr].type != :string
      #   search_string << "cast(\"#{attr}\" as varchar(10)) like :search"
      # else
      search_string << "\"#{attr}\" like :search"
      # end
    end
    # search_col =['sample_name', 'project_name', 'experiment_type']
    # search_col.each do |term|
    #   search_string << "#{term} like :search"
    # end
    


    # will_paginate
    # users = User.page(page).per_page(per_page)
    # samples = @obj.samples.order("#{sort_column} #{sort_direction}")
    obj_start = (page-1) * per_page
    obj_end = obj_start + per_page
    # @obj = @obj.slice(0, 5)
    # puts sort_column
    # puts sort_direction
    # puts @obj[0][sort_column]
    if sort_direction == "asc"
      @obj = @obj.sort_by { |s_record| s_record[sort_column] }
    else
      @obj = @obj.sort_by { |s_record| s_record[sort_column] }.reverse!

    end
    #samples = @obj.slice(obj_start, per_page)
    if params[:search][:value] != ""
      search_values = params[:search][:value]
      # @obj.each do |s_record|
      samples = []
      @obj.each do |s_record|
        @config.each do |attr|
          if s_record[attr].to_s.include? search_values.to_s
            samples.push(s_record)
          end
        end
      end
      samples = samples.slice(obj_start, per_page)
      
    else
      samples = @obj.slice(obj_start, per_page)
    end
    #samples = samples.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
  end

  def columns
    @config
    # %w(first_name last_name email phone_number)
  end

  def sort_column
    columns[params[:order]['0'][:column].to_i - 1]
  end

  # def sort_direction
  #   params[:order]['0'][:dir] == "desc" ? "desc" : "asc"
  # end

end
